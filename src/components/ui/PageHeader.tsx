import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  descriptionClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  backgroundImage = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
  descriptionClassName = '',
}) => {
  return (
    <section 
      className="relative flex items-center pt-40 pb-16 md:pb-24 mt-32 md:min-h-[75vh]"
      style={{
        backgroundImage: `var(--hero-overlay), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-gold bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className={`text-lg md:text-xl leading-relaxed ${descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
