const path = require("path");
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
    };;
