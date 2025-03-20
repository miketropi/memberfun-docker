import React, { useState } from 'react';

const DocumentsTab = ({ documents = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Document Library</h2>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No documents found matching your search.</p>
        </div>
      )}
    </div>
  );
};

const DocumentCard = ({ document }) => {
  const getIconColor = (type) => {
    switch(type.toUpperCase()) {
      case 'PDF':
        return 'bg-red-100 text-red-600';
      case 'DOC':
      case 'DOCX':
        return 'bg-blue-100 text-blue-600';
      case 'XLS':
      case 'XLSX':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 p-3 rounded-lg mr-4 ${getIconColor(document.type)}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{document.title}</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mr-2">
                {document.type}
              </span>
              <span className="text-xs text-gray-500">{document.size}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">Added on {document.date}</p>
        <div className="flex justify-between">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View</button>
          <button className="text-sm text-green-600 hover:text-green-800 font-medium">Download</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab; 