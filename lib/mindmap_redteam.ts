export const dataRedTeam = {
  nodes: [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: '🔍 Reconnaissance' },
        style: { backgroundColor: '#1e293b', color: '#fff', border: '1px solid #f63b44', borderRadius: '8px', padding: '10px' },
    },
    {
        id: '2',
        position: { x: 250, y: -50 },
        data: { label: '🌐 Scan de Ports' },
        style: { backgroundColor: '#1e293b', color: '#fff', border: '1px solid #d61f1f', borderRadius: '8px', padding: '10px' },
    },
    {
        id: '3',
        position: { x: 250, y: 50 },
        data: { label: '📧 Phishing' },
        style: { backgroundColor: '#1e293b', color: '#fff', border: '1px solid #b31313', borderRadius: '8px', padding: '10px' },
    },
    {
        id: '4',
        position: { x: 500, y: 0 },
        data: { label: '🔑 Accès Initial' },
        style: { backgroundColor: '#0f172a', color: '#34d399', border: '2px solid #cf4109', borderRadius: '8px', padding: '10px', fontWeight: 'bold' },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' },
  ]
};