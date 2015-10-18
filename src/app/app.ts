import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import Poll = DTO.Poll;
import Review = DTO.Review;

module DTO {
    export interface Poll {
        id: string;
        question:  string;
        options:   string[];
        multipleAnswers: boolean;
    }

    export interface Review {
        correct:number;
        wrong:number;
    }

    export interface Vote {
        referencePoll:string
        answers: number[]
        correct: boolean
    }
}

@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    selector: 'main',
    styleUrls: ["template/style.css"],
    templateUrl: "template/question.html",
})
class QuestionnaireComponent {
    private polls:Array<string> = [
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-12b94e2ef-6901-4193-90d4-e63cbf89f841",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-20eb2ea9c-4c79-419c-bad0-a918a78e4c91",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-3ed406e0c-c45c-470c-a8a4-59eb773ffddc",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-40297cc17-6cbd-4dd5-a0df-a5df2d53d01d",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-5924d9543-fd4c-4806-9beb-2246a5375cc4",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-62f3f35cc-7e0a-4118-a8a0-199b5912c41c",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-758a912f3-89bc-4911-a1c0-4e4d876c8020",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-85256bad5-5cc2-44ac-8d59-cd37a2d3d397",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-973b60da0-6699-402e-b565-d8087f2a5cb9",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-107f01e097-a7de-4e81-be2a-1376f239cf2b",
    ];
    private poll:Poll;
    private review:Review;
    private questionIdx:number = 0;

    private onAnswer(answer:string):void {
        this.vote();
        QuestionnaireComponent.resetAnswerOptions();
        console.warn(this.questionIdx);
        if (this.questionIdx == this.polls.length - 1) {
            this.review = {correct: 12, wrong: 4};
            this.poll = null;
        } else {
            this.questionIdx++;
            this.showNextPoll();
        }
    }

    private vote():void {
        let vote = function (vote:any):Promise<any> {
            return new Promise<any>((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "votePostURL", true);
                xhr.onload = event => resolve(xhr.response);
                xhr.onerror = event => reject(xhr.statusText);
                xhr.send(vote);
            });
        };

        let voteResponse:Promise<any> = vote({
            referencePoll: "simpsons-12b94e2ef-6901-4193-90d4-e63cbf89f841",
            answers: [1]
        });

        voteResponse.then(data => {
            console.info(data);
            //let poll:Poll = JSON.parse(data.toString());
            //this.poll = poll;
        }).catch(error => {
            console.error(error);
        });
    }

    private showNextPoll():void {
        const pollUrl:string = this.polls[this.questionIdx];

        let fetchPoll = function (url:string):Promise<Poll> {
            return new Promise<Poll>((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onload = event => resolve(xhr.response);
                xhr.onerror = event => reject(xhr.statusText);
                xhr.send();
            });
        };
        let pollResponse:Promise<Poll> = fetchPoll(pollUrl);

        pollResponse.then(pollData => {
            let poll:Poll = JSON.parse(pollData.toString());
            this.poll = poll;
        }).catch(error => {
            console.error(error);
        });
    }

    private static resetAnswerOptions():void {
        let answerOptions:NodeListOf<Element> = document.getElementsByName("options");
        for (let answerOption of answerOptions) {
            answerOption.checked = false;
        }
    }

    constructor() {
        this.showNextPoll();
    }
}

bootstrap(QuestionnaireComponent);