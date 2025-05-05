import { X } from 'lucide-react';
import  AuthForm  from '../../features/auth/components/AuthForm';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md min-h-[400px] shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <AuthForm />
        <div className="mt-4 text-right text-sm text-sky-500 cursor-pointer hover:underline">
        Forgot password?
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
