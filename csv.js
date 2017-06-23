// csv.js
//
// A parser of csv files as specified by rfc4180:
// https://www.ietf.org/rfc/rfc4180.txt
//
// The intention is that reading of all of rfc4180 is implemented, with
// the relaxation that it is not necessary that all records have the
// same number of fields.

"use strict";

// getNextElement
//
// Extracts the next element in the row from file and inserts it into
// csv.elem. The csv.nextRow and csv.nextCol are updated according to
// csv.row and csv.col and which field termination character is found.
function getNextElement (csv,i) {
    var mode = "normal";
    var elemEnd = 0;
    csv.elem = "";

    while ((elemEnd === 0) && (i < csv.content.length)) {
        switch (mode) {
            case "quote":
                if (csv.content[i] === "\"") {
                    if ((i < (csv.content.length + 1)) &&
                        (csv.content[i+1] === "\"")) {
                        csv.elem += "\"";
                        i = i + 2;
                    } else {
                        // End quoted string
                        mode = "normal";
                        i = i + 1;
                    }
                } else {
                    csv.elem += csv.content[i];
                    i = i + 1;
                }
                break;

            default:
                if (csv.content[i] === "\"") {
                    // Begin quoted string
                    mode = "quote";
                    i = i + 1;
                } else if (csv.content[i] === ",") {
                    // Element end
                    csv.nextCol = csv.col + 1;
                    elemEnd = 1;
                    i = i + 1;
                } else if (csv.content[i] === "\n") {
                    // Row end
                    csv.nextRow = csv.row + 1;
                    csv.nextCol = 0;
                    elemEnd = 1;
                    i = i + 1;
                } else {
                    // Read char
                    csv.elem += csv.content[i];
                    i = i + 1;
                }
        }
    }

   return i;
}

// readCSV
//
// Main entry function. Processes passed fileContent and returns
// contents in array, according to [row][column] indices.
function readCSV (fileContent) {
    var array = [];
    var csv = {content:fileContent,
               elem:"",
               row:0,
               col:0,
               nextRow:0,
               nextCol:0,
               apply:function (a) {
                   if (this.col === 0) {
                       // If we're starting a new row, initialise thiw "row" to
                       // be an array.
                       a[this.row] = [];
                   }
                   a[this.row][this.col] = this.elem;
                   this.row = this.nextRow;
                   this.col = this.nextCol;
               }};

   var i = 0;
    while (i < csv.content.length) {
        i = getNextElement(csv,i);
        csv.apply(array);
    }

    return array;
}

