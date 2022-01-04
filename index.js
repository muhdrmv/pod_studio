let app = require("./app")

const PORT = process.env.PORT || 3030;
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log("Server is started successfully. PORT : " + PORT);
})