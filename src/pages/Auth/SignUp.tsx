import SignUpForm from '@/components/forms/SignUpForm';
import BottomNavbar from '@/components/common/footer/BottomNavbar';

const SignUp: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-[430px] my-6 mx-auto p-3">
      <h2 className="">header</h2>
      <SignUpForm />
      <BottomNavbar />
    </div>
  );
};

export default SignUp;
