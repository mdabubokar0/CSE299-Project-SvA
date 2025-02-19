function Card(props) {
  return (
    <div
      className={`text-lg font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col ${
        props.right === "true"
          ? "text-end"
          : ""
      }`}
    >
      {props.title}
      <span className="text-2xl text-center">{props.count}</span>
    </div>
  );
}

export default Card;
