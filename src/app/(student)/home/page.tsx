import ContactForm from '@/components/contact/ContactForm';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="w-full lg:w-1/2">
        <Image 
          src="/contact-illustration.svg"
          alt="Contact Illustration"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="font-outfit font-bold text-4xl mb-4">Contact Us</h1>
        <p className="text-xl mb-8 text-gray-600 font-outfit">
          Some contact information on how to reach out
        </p>
        <ContactForm />
      </div>
    </main>
  );
}