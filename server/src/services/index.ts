const path = require("path"),
 regExp = /.*{(.*?)}$/gmi,
 R = require("ramda"),
 reg2 =/([^\s\\\n\r\t"])*/gmi;
export const getPath = (file: any):string => path.resolve(__dirname, '../../', 'uploadedFiles', file.originalname),
removeNL = (s:string):string => {
    /*
    ** Remove NewLine, CarriageReturn and Tab characters from a String
    **   s  string to be processed
    ** returns new string
    */
    let r = "";
    for (let i=0; i < s.length; i++) {
      if (s.charAt(i) != '\n' &&
          s.charAt(i) != '\r' &&
          s.charAt(i) != '\t') {
        r += s.charAt(i);
        }
      }
    return s.replace(/[\n\r\t]/g, "");
    },
 reformateError = ({message}: {message:string}) => R.when(R.allPass([R.contains('{'), R.contains('}')]), R.compose(R.fromPairs, R.splitEvery(2), R.converge(R.concat,[R.compose(R.map(R.compose(R.reduce(R.concat, ""), R.match(/\w/gmi))), R.slice(0, -2)), R.compose(R.of, R.join(" "), R.takeLast(2))]),R.reject(R.anyPass([R.isEmpty, R.equals(",")])), R.match(reg2), R.trim, R.replace(regExp, "$1")))(message),
 mimeTypes: string[] = ["application/csv",
  "application/x-csv",
  "text/csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values" ],
  headersMain:string[] = ["id", "cardHolderNumberHash", "datetime", "amount"]; 