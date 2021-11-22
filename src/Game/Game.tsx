import { fromEvent, BehaviorSubject, interval,combineLatestWith,combineLatest } from "rxjs";
import { map, switchMap,take,scan} from "rxjs/operators";

const key$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  map((e: KeyboardEvent) => e.key)
);

const intervalSubject$ = new BehaviorSubject(1000);


// const Letters$ = intervalSubject$.pipe(time=>interval(time))

/* 
const intervalMy=intervalSubject$.pipe(map(i=>interval(i))) //il valore emesso in questo caso è un observable non il valore che restituisce interval
intervalMy.subscribe(x=>x.subscribe(y=>console.log(y)));
 */

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateRandomChar(){
    let Acode = 'A'.charCodeAt(0)
    let Zcode = 'Z'.charCodeAt(0);

    const randomAsciiA_Z= getRandomInt(Acode,Zcode);

    return String.fromCharCode(randomAsciiA_Z);

}

//Letters$ è un observable che genera una lettera casuale Ogni secondo
const Letters$ = intervalSubject$.pipe(switchMap(x=>interval(x).pipe(map(y=>generateRandomChar()))),scan<string,string[]>((acc,val)=>{return [...acc,val]},[]))
// Letters$.subscribe(x=>console.log(x));
// Letters$.pipe(combineLatestWith(key$)).subscribe(val=>console.log(val));

// const Letters$Key$ = combineLatest(Letters$,key$);

// Letters$Key$.subscribe(x=>console.log(x));


//keyLetters è una combinazione tra il subscriber e la lettera.
const keyLetters$= key$.pipe(combineLatestWith(Letters$))  




export {};
