import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from "angular2/angular2";
import Poll = DTO.Poll;
import Creation = DTO.Creation;
import Vote = DTO.Vote;
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

        //constructor() {
        //    this.correct = 0;
        //    this.wrong = 0;
        //}
    }

    export interface Vote {
        referencePoll:string
        answers: number[]
        correct?: boolean
    }

    export interface Creation {
        link: string
        id: string
    }
}

@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    selector: "main",
    styleUrls: ["template/style.css"],
    templateUrl: "template/question.html",
})
class Questionnaire {
    private  pollEndpoint:string = "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll";
    private  voteEndpoint:string = "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/vote";
    private polls:Array<string> = [
        this.pollEndpoint + "/simpsons-100885630-0872-4a83-80b7-3070e7de8d49",
        //"this.pollEndpoint + "/simpsons-290534e2b-a676-443e-bb88-2a3756faac5f",
        //"this.pollEndpoint + "/simpsons-3801852cf-a0eb-42cd-be59-99f0c55cfa94",
        //"this.pollEndpoint + "/simpsons-4a440109e-cedb-4427-8edb-61c4c99928cf",
        //"this.pollEndpoint + "/simpsons-5eed90a7e-f0e9-4848-9c43-e35baabbf3a2",
        //"this.pollEndpoint + "/simpsons-63ee0b535-f0b3-4ad4-b39c-9d7b5f7522c5",
        //"this.pollEndpoint + "/simpsons-7d67d76aa-57e9-4581-95b0-43283c4ab237",
        //"this.pollEndpoint + "/simpsons-8a2c8120f-74e2-4368-8711-687468944f98",
        //"this.pollEndpoint + "/simpsons-99c472889-245c-48b9-87bf-335dc0ceff11",
        this.pollEndpoint + "/simpsons-104058ebfa-a3f1-494c-98b8-21daf83476fb"
    ];
    private poll:Poll;
    private review:Review;
    private questionIdx:number = 0;
    private votes:string[] = [];

    private onAnswer(index:number):void {
        let vote = {
            referencePoll: this.poll.id,
            answers: [index]
        };
        this.vote(vote);
        Questionnaire.resetAnswerOptions();
    }

    private reviewVotes():void {
        this.votes.forEach(voteId=> {
            const voteUrl = this.voteEndpoint + "/" + voteId;
            let fetchVote = function (url:string):Promise<any> {
                return new Promise<any>((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onload = event => resolve(xhr.response);
                    xhr.onerror = event => reject(xhr.statusText);
                    xhr.send();
                });
            };
            let voteResponse:Promise<any> = fetchVote(voteUrl);
            this.review = {correct: 0, wrong: 0};

            voteResponse.then(data => {
                let voteReviewed:Vote = JSON.parse(data.toString());
                if (voteReviewed.correct) {
                    this.review.correct++;
                } else {
                    this.review.wrong++;
                }
                this.review = {correct: this.review.correct, wrong: this.review.wrong};
            }).catch(error => {
                console.error(error);
            });
        });
    }

    private vote(vote:Vote):void {
        let castVote = function (vote:any):Promise<any> {
            const voteEndpoint:string = "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/vote";
            return new Promise<any>((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", voteEndpoint, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = event => resolve(xhr.response);
                xhr.onerror = event => reject(xhr.statusText);
                xhr.send(JSON.stringify(vote));
            });
        };

        let voteResponse:Promise<any> = castVote(vote);

        voteResponse.then(data => {
            let creation:Creation = JSON.parse(data.toString());
            this.votes.push(creation.id);
            console.info("this.questionIdx: ", vote.referencePoll);

            if (this.questionIdx == this.polls.length - 1) {
                this.poll = null;
                this.reviewVotes();
            } else {
                this.questionIdx++;
                this.showNextPoll();
            }
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

bootstrap(Questionnaire);