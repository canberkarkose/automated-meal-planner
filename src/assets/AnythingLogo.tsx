/* eslint-disable react/jsx-props-no-spreading */
/* istanbul ignore file */
export const AnythingLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={512}
    height={512}
    viewBox='-30 -20 550 510'
    {...props}
  >
    <path
      fill='#50e88d'
      d='M0 255c0 140.929 114.049 255 255 255l15-270L255 0C114.069 0 0 114.05 0 255z'
    />
    <path
      fill='#00c9ae'
      d='M255 0v510c140.93 0 255-114.051 255-255C510 114.071 395.951 0 255 0z'
    />
    <path
      fill='#fdf3f3'
      d='M30 255c0 124.065 100.935 225 225 225l15-225-15-225C130.935 30 30 130.935 30 255z'
    />
    <path
      fill='#ebe4f0'
      d='M255 30v450c124.065 0 225-100.935 225-225S379.065 30 255 30z'
    />
    <path fill='#38336b' d='M375 300V180h-30v150h75v-30z' />
    <path
      fill='#524798'
      d='M165 180c-24.812 0-45 20.188-45 45v105h30v-45h30v45h30V225c0-24.812-20.186-45-45-45zm-15 75v-30c0-8.27 6.73-15 15-15 8.271 0 15 6.73 15 15v30zM240 180v150h15l10-73.25L255 180z'
    />
    <path fill='#38336b' d='M315 300h-45V180h-15v150h60z' />
  </svg>
);
