import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import Poll = DTO.Poll;
import {CheckboxControlValueAccessor} from "../../node_modules/angular2/src/core/forms/directives/checkbox_value_accessor";

module DTO {
    export interface Poll {
        id: string;
        question:  string;
        answers:   string[];
    }
}

@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    selector: 'app',
    styleUrls: ["template/style.css"],
    templateUrl: "template/question.html"
})
class QuestionnaireComponent {
    public heroes = HEROES;
    public title = 'Tour of Heroes';
    public selectedHero:Hero;
    public poll:Poll;
    public questionIdx:number = 0;

    private onAnswer(answer:string):void {
        this.resetAnswerOptions();
        this.questionIdx++;
        this.getStuff();
    }


    private resetAnswerOptions():void {
        let answerOptions:NodeListOf<Element> = document.getElementsByName("answers");
        for (let answerOption:HTMLInputElement of answerOptions) {
            answerOption.checked = false;
        }
    }

    private getStuff() {
        const polls:Array<string> = [
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

        let fetchPoll = function (url:string):Promise<any> {
            let pollResponse = new Promise<any>((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onload = event => resolve(xhr.response);
                xhr.onerror = event => reject(xhr.statusText);
                xhr.send();
            });

            return pollResponse;
        };

        const pollUrl:string = polls[this.questionIdx];
        let pollResponse = fetchPoll(pollUrl);

        pollResponse.then(pollData => {
            var poll:Poll = JSON.parse(pollData);
            console.log(poll.answers);
            this.poll = poll;
            this.resetAnswerOptions();
        }).catch(error => {
            console.log(error);
        });
    }

    constructor() {
        this.getStuff();
    }

    onSelect(hero:Hero) {
        this.selectedHero = hero;
    }

    getSelectedClass(hero:Hero) {
        return {'selected': hero === this.selectedHero};
    }
}

class Hero {
    id:number;
    name:string;
}

var HEROES:Hero[] = [
    {"id": 11, "name": "Mr. Nice"},
    {"id": 12, "name": "Narco"},
    {"id": 13, "name": "Bombasto"},
    {"id": 14, "name": "Celeritas"},
    {"id": 15, "name": "Magneta"},
    {"id": 16, "name": "RubberMan"},
    {"id": 17, "name": "Dynama"},
    {"id": 18, "name": "Dr IQ"},
    {"id": 19, "name": "Magma"},
    {"id": 20, "name": "Tornado"}
];

bootstrap(QuestionnaireComponent);