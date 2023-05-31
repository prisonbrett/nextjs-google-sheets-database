import React, { Fragment, useEffect, useState } from 'react';
import { animate, stagger } from 'motion';
import { RoughNotation } from 'react-rough-notation'
import JavaScriptLogo from '../components/StackLogo';

const config = [
  {
    name: 'Frontend Development',
    id: 'frontend_development'
  },
  {
    name: 'Software Development',
    id: 'software_development'
  },
  {
    name: 'Cloud Services',
    id: 'cloud_services'
  },
  {
    name: 'Machine Learning',
    id: 'machine_learning'
  },
  {
    name: 'Show me the poll',
    id: 'show_me_the_poll'
  }
];

const Page = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const handleClick = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/create-vote?id=${id}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const result = await response.json();
      setResults(result);
      setIsSubmitting(false);
      setHasVoted(true);
    } catch (error) {
      setIsSubmitting(false);
      setError({
        error: true,
        message: error.message
      });
    }
  };

  useEffect(() => {
    animate(
      '.result-bar',
      { transform: 'translateX(0)' },
      {
        delay: stagger(0.1),
        duration: 0.5,
        easing: 'ease-out'
      }
    );
  }, [hasVoted]);

  return (
    <section className="border border-zinc-800 rounded-lg px-4 py-6 sm:p-8 max-w-3xl mx-auto">
      <div className="grid gap-4">
        <JavaScriptLogo />
        <p className="m-0 text-zinc-200 text-sm sm:text-lg mb-2 sm:mb-4">
        Which tech stack{' '}
          <RoughNotation
                type="underline"
                show={true}
                color="#F97316"   // #FBCFE8
                animationDelay={1500}
                animationDuration={3000}
                multiline={true}
              >
                ignites your coding passion and unleashes your inner digital wizardry?&nbsp;
              </RoughNotation>
              Cast your digital ballot right down there!
        </p>
        <div className="grid gap-4 sm:gap-6 mb-2 sm:mb-4">
          {!hasVoted ? (
            <Fragment>
              {config.map((item, index) => {
                const { name, id } = item;

                return (
                  <button
                    key={index}
                    className="flex justify-center text-zinc-200 font-bold border border-zinc-800 text-xs sm:text-sm rounded-full w-full overflow-hidden transition-colors duration-300 hover:bg-primary/10 hover:border-primary/20 disabled:bg-neutral-900 disabled:cursor-not-allowed disabled:text-zinc-700"
                    onClick={() => handleClick(id)}
                    disabled={isSubmitting || error}
                  >
                    <span className="p-2 sm:p-3">{name}</span>
                  </button>
                );
              })}
            </Fragment>
          ) : (
            <Fragment>
              {results.data.map((result, index) => {
                const { percent, isMax } = result;
                const name = config[index].name;
                return (
                  <div
                    key={index}
                    className={`relative flex items-center justify-between text-zinc-200 text-xs sm:text-sm ${
                      isMax ? 'font-bold' : ''
                    } rounded-lg w-full overflow-hidden`}
                  >
                    <span
                      className={`result-bar absolute top-0 left-0 h-full ${isMax ? 'bg-primary/90' : 'bg-zinc-800'} rounded-lg z-0 -translate-x-full`}
                      style={{
                        width: `${percent}%`
                      }}
                    />
                    <span className="p-2 sm:p-3 z-10">{name}</span>
                    <span className="p-2 sm:p-3 z-10">{`${percent}%`}</span>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>
        {hasVoted ? <p className="m-0 text-sm text-amber-200">{`${results.total} votes`}</p> : null}
        {error ? <p className="m-0 text-sm font-bold text-red-500">{error.message}</p> : null}
      </div>
    </section>
  );
};

export default Page;
