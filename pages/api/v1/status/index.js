function status(request, response) {
  response.status(200).send({ message: "Tudo certo!" });
}

export default status;
