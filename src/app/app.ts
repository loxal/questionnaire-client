import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import Poll = DTO.Poll;
import Review = DTO.Review;

module DTO {
    export interface Poll {
        id: string;
        question:  string;
        answers:   string[];
    }

    export interface Review {
        correct:number;
        wrong:number;
    }
}

@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    selector: 'main',
    styleUrls: ["template/style.css"],
    templateUrl: "template/question.html"
})
class QuestionnaireComponent {
    private polls:Array<string> = [
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-10ca791ed-a4a4-48f7-95a8-51df6c9e8bca",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-2c9fed178-d6d4-436c-86cb-fef2f4d04e20",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-3b170a2f4-d703-4259-9a6c-1a622416f5ea",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-4bd8b792f-d805-49a3-9b61-56606d8656fc",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-50c73578d-71b0-43b1-a585-3f2de6183b5d",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-6b336bd70-9871-4ef8-bddc-3f0de353ee9c",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-76d06b2eb-d723-4b9b-859d-d33c86ad5124",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-870bfc198-d28e-4d59-9826-d3c1b37d292e",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-9546b4f95-c432-4466-9756-37046762f278",
        "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-10963314a1-2953-44d7-9afc-5434591eddf9",
    ];
    private poll:Poll;
    private review:Review;
    private questionIdx:number = 0;

    private onAnswer(answer:string):void {
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
        let answerOptions:Array<any> = new Array(document.getElementsByName("answers"));
        for (let answerOption of answerOptions) {
            answerOption.checked = false;
        }
    }

    constructor() {
        this.showNextPoll();
    }
}

bootstrap(QuestionnaireComponent);