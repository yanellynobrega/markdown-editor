const File = require('../models/file.js');

exports.create = (req, res) => {
    const file = new File({
        title: req.body.title || "Untitled File",
        content: req.body.content
    });
    file.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the File."
        });
    });
};

exports.getAll = (req, res) => {
    File.find()
        .then(files => {
            res.send(files);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving files."
        });
    });
};

exports.update = (req, res) => {
    File.findByIdAndUpdate(req.params.fileId, {
        title: req.body.title || "Untitled File",
        content: req.body.content || "",
    }, {new: true})
        .then(file => {
            if(!file) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send(file);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "File not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            message: "Error updating file with id " + req.params.fileId
        });
    });
};

exports.delete = (req, res) => {
    File.findByIdAndRemove(req.params.fileId)
        .then(file => {
            if(!file) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send({message: "File deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "File not found with id " + req.params.fileId
            });
        }
        return res.status(500).send({
            message: "Could not delete file with id " + req.params.fileId
        });
    });
};