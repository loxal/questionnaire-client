import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    selector: 'app',
    styleUrls: ["style.css"],
    templateUrl: "template.html"
})

class AppComponent {
    public heroes = HEROES;
    public title = 'Tour of Heroes';
    public selectedHero:Hero;

    onSelect(hero:Hero) {
        this.selectedHero = hero;
        var p = new Promise<string>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://rest-kit-v1.us-east.stage.internal.yaas.io/dilbert-quote/programmer", /*async:*/ true);
            xhr.onload = event => resolve(xhr.responseText);
            xhr.onerror = event => reject(xhr.statusText);
            xhr.send(null);
        });

        p.then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        });

        //console.log(p);
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
