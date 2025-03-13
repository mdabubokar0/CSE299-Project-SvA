function Card(props) {
  return (
    <div className="text-lg text-center font-medium w-full h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
      {props.title}
      <span className="text-2xl text-center">{props.count}</span>
    </div>
  );
}

export default Card;
