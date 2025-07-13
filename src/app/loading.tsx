const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 tracking-wide">
          Loading properties
        </p>
      </div>
    </div>
  );
};

export default loading;
