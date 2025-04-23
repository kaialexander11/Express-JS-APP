const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const { addMatrix, getMatrix } = require('./matrix');

// ADD HANDLEBARS to EXPRESS:
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

app.set('view engine', 'hbs');

// Add third party middleware:
const bodyParser = express.urlencoded({ extended: false });
app.use(bodyParser);

// CSS LINE!!!
app.use(express.static('public'));


// Add middlewares:
app.use((req, res, next) => {

    console.log('Middleware1');
    next();

});


app.use((req, res, next) => {

    console.log(`HTTP Request ${req.method}: ${req.path}`);
    next();

});

// Partial route middleware: 
app.use('/matrix', (req, res, next) => {
    console.log('Matrix middleware');

    next();
});


// Route specific middleware: 
const specificMiddleware = (req, res, next) => {
    console.log('Specific middleware only for this route.');
    next();
}

app.get('/specific', (req, res, next) => specificMiddleware, (req, res) => {
    res.send('Some specific route with middleware.');
});

 
// Express router / Actions
app.get('/', (req, res) => {
    //res.status(200).send('Hello from Express!');
    res.render('home');
});


app.get('/about', (req, res) => {
    res.render('about');
});


// VALID, BUT DON'T DO THIS AT HOME!
// app.get('/css/style.css', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/css/style.css'));
// });

// This is called ACTION!
app.get('/matrix', (req, res) => {

    const matrix = getMatrix();

    //console.log(matrix);

    //const firstMatrix = matrix[0];

    //res.render('matrix', firstMatrix);
    res.render('matrix', { matrix });
});

app.post('/matrix', (req, res) => {

    addMatrix(req.body.name, Number(req.body.age));

    res.redirect('/matrix');
    //console.log(req.body);
    //res.status(201).send('A new cycle of the Matrix has been initiated.')
});

app.get('/matrix/:matrixId', (req, res) => {

    const catId = Number(req.params.catId);

    if (!catId) {
        return res.status(404).send('Cannot find matrix hero!');
    }

    console.log(req.params);
    res.send(`Request with parameter - ${req.params.matrixId}!`);
});


app.get('/download', (req, res) => {
    //res.download('./art.pdf');
    // res.attachment('./art.pdf');
    // res.end();

    res.sendFile(path.resolve(__dirname, './art.pdf'));
});

app.get('/old-route', (req, res) => {
    res.redirect('/cats');
});


//Generic route:
// app.get('*', (req, res) => {
//     res.status(404).send('Not Found');
// });

// End of Express Router

app.listen(5000, () => console.log('Server is listening on port 5000... '));