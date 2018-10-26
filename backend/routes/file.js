module.exports = (app) => {
    const files = require('../controllers/file.js');
    app.post('/files', files.create);
    app.get('/files', files.getAll);
    app.put('/files/:fileId', files.update);
    app.delete('/files/:fileId', files.delete);
};