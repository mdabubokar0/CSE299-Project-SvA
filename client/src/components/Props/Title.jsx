function Title(props) {
  return (
    <>
      <h1 className="text-center font-reospec mt-10 text-[100px] leading-none">
        {props.title}
      </h1>
      <p className="text-center text-sm font-medium">{props.subtitle}</p>
    </>
  );
}
export default Title;