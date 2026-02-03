// PageHeader.tsx

type PageHeaderProps = {
  title: string; // title MUST be a string
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="bg-gray py-4 text-center">
      <h2 className="text-3xl font-bold">{<title />}</h2>
      <p className="text-gray-500 mt-4 text-sm">
        <span className="hover:text-blue-600 cursor-pointer">Home</span> /{" "}
        {title}
      </p>
    </div>
  );
};

export default PageHeader;
