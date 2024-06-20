export const BestWorstHeader = ({ view }: { view: string }) => (
  <div className="mx-auto max-w-2xl lg:text-center">
    <h1 className="font-bold text-indigo-600">Best and Worst</h1>
    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
      View the best and worst {view} for your stocks
    </p>
    <p className="mt-9 leading-7 text-white">
      Symbols can be comma-separated or entered on a new line.
    </p>
  </div>
);
