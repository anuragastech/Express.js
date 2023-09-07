const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

const formFilePath = path.join(__dirname, 'form.json');
if (!fs.existsSync(formFilePath)) {
    fs.writeFileSync(formFilePath, '[]');
}

app.get('/', (req, res) => {
 
    fs.readFile(formFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const jsonData = JSON.parse(data);
            res.render('display', { data: jsonData });
        }
    });
});
    
  
app.post('/submit', (req, res) => {
    const formData = req.body;

    fs.readFile(formFilePath, 'utf8', (err, existingData) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            let existingDataArray = [];

            try {
                existingDataArray = JSON.parse(existingData);
                if (!Array.isArray(existingDataArray)) {
                    existingDataArray = [];
                }
            } catch (parseError) {
                existingDataArray = [];
            }

            existingDataArray.push({
                name: formData.name,
                email: formData.email,
                id: formData.id,
                age: formData.age,
            });

            fs.writeFile(
                formFilePath,
                JSON.stringify(existingDataArray, null, 2),
                (err) => {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                        console.error(err);
                    } else {
-                        res.redirect('/');
                    }
                }
            );
        }
    });
});

app.delete('/delete/:name', (req, res) => {
    const nameToDelete = req.params.name;

    fs.readFile(formFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            let jsonData = JSON.parse(data);

            jsonData = jsonData.filter((item) => item.name !== nameToDelete);

           
            fs.writeFile(formFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send('Data deleted successfully');
                }
            });
        }
    });
});

app.put('/update/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedData = req.body;
    console.log(req.body.name);
    console.log(itemId)
    console.log(updatedData)

    fs.readFile(formFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            let jsonData = JSON.parse(data);

            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id === itemId) {
                    jsonData[i] = updatedData;
                    break;
                }
            }

            fs.writeFile(formFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send('Data updated successfully');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
