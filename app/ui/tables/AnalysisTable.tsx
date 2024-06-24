import React, { useState, useEffect } from 'react';

interface Analysis {
  id: string;
  status: number;
  coverage: number;
  suspect_containment: number;
  estimated_time: string;
}

const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <table className="min-w-full bg-white border border-gray-300">{children}</table>
);

const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody>{children}</tbody>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr>{children}</tr>
);

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="border-t border-gray-300 px-4 py-2">{children}</td>
);

const TableHeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>
);

const Progress: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    {/* <span className="sr-only">{value}%</span> */}
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${value}%` }}
    >
    </div>
  </div>
);

const AnalysisTable: React.FC = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8001/ws/analyses2/?token=b88f918faa29fb128b59bf9acb57bf6311a36e65');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAnalyses(data);
      // console.log(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'En progreso';
      case 2: return 'Completado';
      case 3: return 'Revisado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cola de análisis</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Documento</TableHeaderCell>
            <TableHeaderCell>Contra</TableHeaderCell>
            <TableHeaderCell>Subido el</TableHeaderCell>
            <TableHeaderCell>Mínimo palabras</TableHeaderCell>
            <TableHeaderCell>Copia</TableHeaderCell>
            <TableHeaderCell>Tiempo restante</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Progreso</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow key={analysis.id}>
              <TableCell>{analysis.id}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{(analysis.suspect_containment * 100).toFixed(2)}%</TableCell>
              <TableCell>{analysis.estimated_time}</TableCell>
              <TableCell>{getStatusText(analysis.status)}</TableCell>
              <TableCell>
                <span className="">{analysis.coverage}%</span>
                <Progress value={analysis.coverage} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisTable;