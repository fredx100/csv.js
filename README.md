csv.js
======

This library provides a readCSV, which parses CSV ([rfc4180][l1] compliant)
into a 2D array.

USAGE
-----

The readCSV function reads a string containing the CSV content. Using a
FileReader object similarly to the following will populate the array
"A".

    var A;
    var reader = new FileReader();
    reader.onload = function(){
        A = readCSV(this.result);
    };
    reader.readAsText(filename);

INSTALLATION
------------

There are no external dependencies. Place csv.js somewhere readable and
source it from within the HEAD of your HTML, like so

    <script src="path/to/csv.js"></script>

[l1]: https://www.ietf.org/rfc/rfc4180.txt
