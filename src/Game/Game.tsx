import {
  fromEvent,
  BehaviorSubject,
  interval,
  combineLatestWith,
  startWith,
} from "rxjs";
import { map, switchMap, take, scan } from "rxjs/operators";

const key$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  startWith({ key: "" } as KeyboardEvent),
  map((e: KeyboardEvent) => e.key)
);

const intervalSubject$ = new BehaviorSubject(600);

type keyLetterArray = [string, string[]];
type GameStatus = { status: keyLetterArray; points: number };

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomChar() {
  let Acode = "a".charCodeAt(0);
  let Zcode = "z".charCodeAt(0);

  const randomAsciiA_Z = getRandomInt(Acode, Zcode);

  return String.fromCharCode(randomAsciiA_Z);
  // return 'a'
}

//Letters$ è un observable che genera una lettera casuale Ogni secondo
const Letters$ = intervalSubject$.pipe(
  switchMap((x) => interval(x).pipe(map((y) => generateRandomChar()))),
  scan<string, string[]>((acc, val) => {
    return [val, ...acc];
  }, [])
);

//keyLetters è una combinazione tra il subscriber e la lettera.
const keyLetters$ = key$.pipe(combineLatestWith(Letters$));

const game$ = keyLetters$.pipe(
  scan<keyLetterArray, GameStatus>((state, keyletters) => {
    let points = (state as GameStatus).points || 0;
    let newLetters = keyletters[1];
    if (keyletters[0] === keyletters[1][keyletters[1].length - 1]) {
      points = points + 1;
      newLetters.pop();
    }
    return { points: points, status: [keyletters[0], newLetters] };
  })
);

const renderGame = (state: GameStatus | keyLetterArray) => {
  document.body.innerHTML = `Score: ${(state as GameStatus).points} <br/>`;
  document.body.innerHTML += `${(state as GameStatus).status[0]} <br/> ${
    (state as GameStatus).status[1]
  }`;
};

game$.subscribe(renderGame);

export {};
