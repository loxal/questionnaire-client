import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import Poll = DTO.Poll;

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
class AppComponent {
    public heroes = HEROES;
    public title = 'Tour of Heroes';
    public selectedHero:Hero;
    public poll:Poll;

    onAnswer(answer:string) {
        console.log(answer);
        console.log(this.poll.answers);
    }

    getStuff() {
        var pollResponse = new Promise<any>((resolve, reject) => {
            const url:string = "https://api.stage.yaas.io/loxal/rest-kit/v1/ballot/poll/simpsons-42e1dd4d7-32f7-4dd2-8d78-5a94a983360b";
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = event => resolve(xhr.response);
            xhr.onerror = event => reject(xhr.statusText);
            xhr.send();
        });

        pollResponse.then(pollData => {
            var poll:Poll = JSON.parse(pollData);
            console.log(poll.question);
            console.log(poll.answers);
            this.poll = poll;
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

bootstrap(AppComponent);