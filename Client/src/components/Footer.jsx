import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsGithub, BsLinkedin } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className='border-t-8 border-teal-500 bg-gray-900 text-white'>
      <div className='w-full max-w-7xl mx-auto py-10'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' className='text-teal-400' />
              <Footer.LinkGroup col className='space-y-2'>
                <Footer.Link
                  href='https://www.100jsprojects.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-teal-300 transition-colors'
                >
                  100 JS Projects
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-teal-300 transition-colors'
                >
                  BlogBreeze
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' className='text-teal-400' />
              <Footer.LinkGroup col className='space-y-2'>
                <Footer.Link
                  href='https://www.github.com/sahandghavidel'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-teal-300 transition-colors'
                >
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' className='text-teal-400' />
              <Footer.LinkGroup col className='space-y-2'>
                <Footer.Link
                  href='/privacy'
                  className='hover:text-teal-300 transition-colors'
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='#'
                  className='hover:text-teal-300 transition-colors'
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider className='border-gray-600 my-6' />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Rohan's BlogBreeze"
            year={new Date().getFullYear()}
            className='text-gray-500'
          />
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <Footer.Icon
              href='https://www.facebook.com/rohan.kumar0112/'
              icon={BsFacebook}
              className='text-teal-400 hover:text-teal-300 transition-colors'
            />
            <Footer.Icon
              href='https://www.instagram.com/rohanvig7844/'
              icon={BsInstagram}
              className='text-teal-400 hover:text-teal-300 transition-colors'
            />
            <Footer.Icon
              href='https://www.linkedin.com/in/rohankumar2/'
              icon={BsLinkedin}
              className='text-teal-400 hover:text-teal-300 transition-colors'
            />
            <Footer.Icon
              href='https://github.com/rohanvig'
              icon={BsGithub}
              className='text-teal-400 hover:text-teal-300 transition-colors'
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
