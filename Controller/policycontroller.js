const fs = require("fs");
//const multer = require('multer');
const csvParser = require("csv-parser");
const path = require("path");
const propertyPolicy = require("../Models/propertyPolicy");
const fileUpload = require("../Models/fileUpload");
const json2csv = require("json2csv");
const pump = require("pump");
const Papa = require("papaparse");
const { Readable } = require("stream");
const { count } = require("console");
const { connected } = require("process");

const addPolicy = async (req, res) => {
  try {
    const {
      idType,
      insuredType,
      financialYear,
      insurerName,
      insurerCode,
      place,
      latitude,
      longitude,
      pan,
      uipi,
      policyNumber,
      policyStartDate,
      policyEndDate,
      createdBy,
    } = req.body;

    const newpolicy = propertyPolicy({
      idType,
      insuredType,
      financialYear,
      insurerName,
      insurerCode,
      place,
      latitude,
      longitude,
      pan,
      uipi,
      policyNumber,
      policyStartDate,
      policyEndDate,
      createdBy,
    });

    console.log(newpolicy);
    const savedpolicy = await newpolicy.save();
    //
    res.status(201).json(savedpolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getPolicy = async (req, res) => {
  try {
    //const currentUser = req.user;

    const policyNumber = req.body.policyNumber;
    const foundPolicy = await propertyPolicy.findOne({ policyNumber });

    if (!foundPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json(foundPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getPolicies = async (req, res) => {
  try {
    const allPolicies = await propertyPolicy.find();
    res.status(200).json(allPolicies);
  } catch (error) {
    console.error("Error in getAllPolicies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updatePolicy = async (req, res) => {
  try {
    const policyNumber = req.body.policyNumber;
    const updatedPolicy = await propertyPolicy.findOneAndUpdate(
      { policyNumber },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json(updatedPolicy);
  } catch (error) {
    console.error("Error in updatePolicy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const deletePolicy = async (req, res) => {
  try {
    const policyNumberToDelete = req.body.policyNumber; // Assuming policyNumber is passed as a parameter in the URL

    // const currentUser = req.user;

    const deletedUser = await propertyPolicy.deleteOne({
      policyNumber: policyNumberToDelete,
    });

    if (deletedUser.deletedCount === 0) {
      throw new Error("User with the specified policyNumber not found.");
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteFileUpload = async (req, res) => {
  const fileUploadId = req.body._id;

  try {
    // Find the fileUpload document by its ID

    const fileUploadDocument = await fileUpload.findById({ _id: fileUploadId });

    if (!fileUploadDocument) {
      return res.status(404).json({ error: "FileUpload not found." });
    }

    // Delete the corresponding entries in the propertyPolicy collection
    await propertyPolicy.deleteMany({ fileUploadid: fileUploadDocument._id });
    await fileUpload.deleteOne({ _id: fileUploadDocument._id });
    // Delete the fileUpload document
    // await fileUploadDocument.remove();

    res
      .status(200)
      .json({
        message: "FileUpload and associated data deleted successfully.",
      });
  } catch (error) {
    console.error("Error deleting fileUpload and associated data:", error);
    res
      .status(500)
      .json({
        error:
          "Internal Server Error in deleting fileUpload and associated data.",
      });
  }
};
const downloadCsv = async (req, res) => {
  const requestedInsurerName = req.body.insurerName;
  try {
    const fileUploadIds = await propertyPolicy.find({
      insurerName: requestedInsurerName,
    });
    if (!fileUploadIds || fileUploadIds.length === 0) {
      return res
        .status(404)
        .send(
          "No matching fileUpload documents found for the specified insurerName"
        );
    }

    // // Convert data to CSV format
    const policies = [];

    fileUploadIds.forEach((policyItem) => {
      const {
        idType,
        insuredType,
        financialYear,
        insurerName,
        insurerCode,
        place,
        latitude,
        longitude,
        pan,
        uipi,
        policyNumber,
        policyStartDate,
        policyEndDate,
        createdBy,
      } = policyItem;

      policies.push({
        idType,
        insuredType,
        financialYear,
        insurerName,
        insurerCode,
        place,
        latitude,
        longitude,
        pan,
        uipi,
        policyNumber,
        policyStartDate,
        policyEndDate,
        createdBy,
      });
    });

    const csvFields = [
      "idType",
      "insuredType",
      "financialYear",
      "insurerName",
      "insurerCode",
      "place",
      "latitude",
      "longitude",
      "pan",
      "uipi",
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "createdBy",
    ];

    const csvParser = new json2csv.Parser({ fields: csvFields });
    const csvData = csvParser.parse(policies);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=${fileUploadIds}.csv"
    );

    res.status(200).end(csvData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const downloadfiles = async (req, res) => {
  const requestedFileName = req.body.fileName;
  try {
    const fileUploadIds = await fileUpload
      .find({ fileName: requestedFileName })
      .distinct("_id");
    console.log(fileUploadIds);
    if (!fileUploadIds || fileUploadIds.length === 0) {
      return res
        .status(404)
        .send(
          "No matching fileUpload documents found for the specified filename"
        );
    }

    const propertyPolicyData = await propertyPolicy.find({
      fileUploadid: { $in: fileUploadIds },
    });

    // // Convert data to CSV format
    const policies = [];

    propertyPolicyData.forEach((policyItem) => {
      const {
        idType,
        insuredType,
        financialYear,
        insurerName,
        insurerCode,
        place,
        latitude,
        longitude,
        pan,
        uipi,
        policyNumber,
        policyStartDate,
        policyEndDate,
        createdBy,
      } = policyItem;

      policies.push({
        idType,
        insuredType,
        financialYear,
        insurerName,
        insurerCode,
        place,
        latitude,
        longitude,
        pan,
        uipi,
        policyNumber,
        policyStartDate,
        policyEndDate,
        createdBy,
      });
    });

    const csvFields = [
      "idType",
      "insuredType",
      "financialYear",
      "insurerName",
      "insurerCode",
      "place",
      "latitude",
      "longitude",
      "pan",
      "uipi",
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "createdBy",
    ];

    const csvParser = new json2csv.Parser({ fields: csvFields });
    const csvData = csvParser.parse(policies);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + requestedFileName
    );

    res.status(200).end(csvData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


const bulkUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Access the CSV file from the request
    const csvBuffer = req.file.buffer.toString();
    const csvData = [];
    const parser = csvParser();
    let conditionMet = false; // Flag to check if condition on line 39 is met
   
    parser.on('data', (data) => {
      if (data.latitude && data.pan && data.longitude) {
       
        conditionMet = true; // Set the flag if condition is met
        // Additional processing (like generating UIPI) goes here
        const lat = parseFloat(data.latitude);
        const long = parseFloat(data.longitude);
  
        if (!isNaN(lat) && !isNaN(long)) {
          try {
            const { uipi } = generateUIPI(lat, data.pan, long);
            data["uipi"] = uipi;
          } catch (error) {
            console.error('Error generating UIPI:', error);
            // Handle the error appropriately
          }
        } else {
          console.log('Invalid data format for UIPI generation');

      }
    }
    else {
      conditionMet=false;
      res.status(500).json({ error: 'Missing required data for UIPI generation' });
      // Handle missing data appropriately
    }
      // Push data to csvData array
      // console.log(c);
      csvData.push(data);

    });

    parser.on('end', async () => {
      if (conditionMet) {
        // Now create and save newFileUpload as the condition is met
        const newFileUpload = new fileUpload({
          financialYear: req.body.financialYear,
          fileName: req.file.originalname,
          totalEntries: csvData.length, // Assuming totalEntries is the length of CSV data
          createdBy: req.user._id,
          insurerName: req.body.insurerName,
          insurerCode: req.body.insurerCode,
        });
        // console.log("Beofre "+csvData);
        const savedFileUploadid = await newFileUpload.save();
        let id=savedFileUploadid._id;
        csvData.map(c=>{
           c['fileUploadid']=id;
        })
        
        // Save CSV data to MongoDB for propertyPolicy collection
        try {
          await propertyPolicy.insertMany(csvData);
          res.status(201).json({
            message: 'File and CSV data successfully uploaded to MongoDB.',
       
          });
        } catch (error) {
          console.error('Error saving data to MongoDB:', error);
          res.status(500).json({ error: 'Internal Server Error in saving data in MongoDB' });
        }
      } else {
        // Handle case where condition is not met
        res.status(400).json({ error: 'CSV file does not meet the required condition.' });
      }
    });

    parser.on('error', (error) => {
      console.error('Error during CSV parsing:', error);
      res.status(500).json({ error: 'Internal Server Error during CSV parsing' });
    });

    parser.write(csvBuffer);
    parser.end();
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    res.status(500).json({ error: 'Internal Server Error Uploading CSV file' });
  }
};

// Function to parse CSV and get row count
function RowCount(csvData) {
  return new Promise((resolve, reject) => {
    let rowCount = 0;
    const stream = Readable.from(csvData);

    stream
      .pipe(csvParser())
      .on("data", () => {
        rowCount += 1;
      })
      .on("end", () => {
        resolve(rowCount);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
function generateUIPI(lat, pan, long) {
  // Validate input parameters
  if (
    typeof lat !== "number" ||
    typeof pan !== "string" ||
    typeof long !== "number"
  ) {
    throw new Error("Invalid input parameters");
  }
  const formattedLat = lat.toFixed(2);
  const formattedLong = long.toFixed(2);

  // Generate UIPI number
  const uipi = `${formattedLat}${pan}${formattedLong}`;

  // Format UIPI number for frontend view
  const formattedUIPI = `${lat}-${pan}-${long}`;

  // Return UIPI number
  return { uipi, formattedUIPI };
}

module.exports = {
  addPolicy,
  getPolicy,
  getPolicies,
  updatePolicy,
  deletePolicy,
  bulkUpload,
  deleteFileUpload,
  downloadCsv,
  downloadfiles,
};
