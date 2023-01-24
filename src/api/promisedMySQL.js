module.exports = (connection, query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
            if(error) return reject(error);

            resolve(result);
        })
    });
}