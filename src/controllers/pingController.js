async function ping(_, res) {
    res.status(200).send("Ping Exitoso");
}

module.exports = {
  ping
};
