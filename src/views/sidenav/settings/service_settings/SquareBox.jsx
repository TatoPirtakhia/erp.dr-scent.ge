const SquareBox = (props) => {
  const { color } = props;
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-[30px] h-[30px] border-2 cursor-pointer  rounded-md`}
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default SquareBox;
