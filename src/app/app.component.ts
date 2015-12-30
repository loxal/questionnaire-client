import {Component} from 'angular2/core';
import Poll = DTO.Poll;
import Creation = DTO.Creation;
import Vote = DTO.Vote;
import {bootstrap} from "angular2/bootstrap";

module DTO {
    export const serviceEndpoint:string = "http://rest-kit.loxal.net";
    export const voteEndpoint:string = serviceEndpoint + "/ballot/vote";
    export const pollEndpoint:string = serviceEndpoint + "/ballot/poll";

    export class Poll {
        id: string;
        question:  string;
        options:   string[];
        multipleAnswers: boolean;

        constructor(id:string, question:string, options:string[], multipleAnswers:boolean = false) {
            this.id = id;
            this.question = question;
            this.options = options;
            this.multipleAnswers = multipleAnswers;
        }
    }

    export class Review {
        private _correct:number;
        set correct(v:number) {
            this._correct = v;
        }
        get correct() {
            return this._correct;
        }

        private _wrong:number;
        set wrong(v:number) {
            this._wrong = v;
        }
        get wrong() {
            return this._wrong;
        }

        private _total:number;
        get total() {
            return this.correct + this.wrong;
        }

        constructor(correct:number, wrong:number) {
            this.correct = correct;
            this.wrong = wrong;
        }
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
    selector: "main",
    styleUrls: ["template/style.css"],
    templateUrl: "template/question.html",
})
export class Questionnaire {
    private polls:Array<string> = [
        DTO.pollEndpoint + "/simpsons-17d5313d0-fa6d-470a-af2f-784b1fdcd1af",
        DTO.pollEndpoint + "/simpsons-221402597-d15c-43a2-891c-e6074db0f457",
        DTO.pollEndpoint + "/simpsons-3fa29491d-9cac-40de-b28d-cc3a4339798b",
        DTO.pollEndpoint + "/simpsons-4e7b62074-66b8-4fdb-a075-badeef7d7e24",
        DTO.pollEndpoint + "/simpsons-5885c885f-2466-4fd6-ab86-7e9f2d54f7a0",
        DTO.pollEndpoint + "/simpsons-6351b1d7a-8da6-42ed-b57b-a4f173191139",
        DTO.pollEndpoint + "/simpsons-7252f4c89-1682-4320-a165-5e907451c057",
        DTO.pollEndpoint + "/simpsons-85472713d-0a38-4350-99f5-7d97c64c45ad",
        DTO.pollEndpoint + "/simpsons-91b5e4fe9-1bb9-4852-ad35-a801f0339279",
        DTO.pollEndpoint + "/simpsons-10238409f7-a825-457d-bca1-3294f67b2c1f"
    ];
    private poll:Poll;
    private review:DTO.Review;
    private questionIdx:number = 0;
    private votes:string[] = [];

    private onPlayAgain() {
        this.review = null;
        this.constructor();
    }

    private onAnswer(index:number, $event:any):void {
        $event.target.checked = false;

        let vote = {
            referencePoll: this.poll.id,
            answers: [index]
        };
        this.castVote(vote);
    }

    private reviewVotes():void {
        this.votes.forEach(voteId => {
            const voteUrl = DTO.voteEndpoint + "/" + voteId;
            let fetchVote = function (url:string):Promise<any> {
                return new Promise<any>((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onload = event => resolve(xhr.response);
                    xhr.onerror = event => reject(xhr.statusText);
                    xhr.send();
                });
            };
            let voteResponse:Promise<Vote> = fetchVote(voteUrl);
            this.review = new DTO.Review(0, 0);

            voteResponse.then(data => {
                let voteReviewed:Vote = JSON.parse(data.toString());
                if (voteReviewed.correct) {
                    this.review.correct++;
                } else {
                    this.review.wrong++;
                }
            }).catch(error => {
                console.error(error);
            });
        });
    }

    private castVote(vote:Vote):void {
        let castVote = function (vote:Vote):Promise<Vote> {
            return new Promise<Vote>((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                console.log(4);
                xhr.open("POST", DTO.voteEndpoint, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = event => resolve(xhr.response);
                xhr.onerror = event => reject(xhr.statusText);
                xhr.send(JSON.stringify(vote));
            });
        };

        let voteResponse:Promise<Vote> = castVote(vote);

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

    constructor() {
        this.showNextPoll();
    }
}