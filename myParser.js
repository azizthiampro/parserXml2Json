const pd = require('pretty-data').pd;
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

// Function to determine if the input is JSON
function isJSON(input) {
    try {
        JSON.parse(input);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to convert XML to JSON
function convertXMLtoJSON(xml, callback) {
    parser.parseString(xml, (err, result) => {
        if (err) callback(err, null);
        else callback(null, JSON.stringify(result, null, 2));
    });
}

// Function to convert JSON to XML and beautify
function convertJSONtoXML(json, callback) {
    try {
        const obj = JSON.parse(json);
        let xml = builder.buildObject(obj);
        xml = pd.xml(xml); // Beautify the XML
        callback(null, xml);
    } catch (e) {
        callback(e, null);
    }
}

// Function to write JSON data to write.json
function writeJSON(data) {
    const jsonData = JSON.stringify(data, null, 2); // Convert the data to a formatted JSON string
    fs.writeFile('write.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error("Error writing JSON to file:", err);
        } else {
            console.log("Successfully wrote JSON to write.json");
        }
    });
}

// Function to write XML data to write.xml
function writeXML(xml) {
    fs.writeFile('write.xml', xml, 'utf8', (err) => {
        if (err) {
            console.error("Error writing XML to file:", err);
        } else {
            console.log("Successfully wrote XML to write.xml");
        }
    });
}

// Function to read and convert the file
function convertFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        if (isJSON(data)) {
            convertJSONtoXML(data, (err, xml) => {
                if (err) {
                    console.error("Error converting JSON to XML:", err);
                } else {
                    console.log("Converted JSON to XML:\n", xml);
                    writeXML(xml); // Write the converted and beautified XML to a file
                }
            });
        } else {
            convertXMLtoJSON(data, (err, json) => {
                if (err) {
                    console.error("Error converting XML to JSON:", err);
                } else {
                    console.log("Converted XML to JSON:\n", json);
                    writeJSON(JSON.parse(json)); // Write the converted JSON to a file
                }
            });
        }
    });
}

// Example usage
convertFile('data.xml');
