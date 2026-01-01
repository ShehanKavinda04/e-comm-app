
import Card from './Card'; // Your custom empty cart component

const EmptyCart = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 ">
      <Card />
    </div>
  );
};

export default EmptyCart;