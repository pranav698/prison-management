const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

const Card = ({ children, className = "" }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="mb-4">
        {children}
    </div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold">
        {children}
    </h2>
);

const CardContent = ({ children }) => (
    <div className="mt-4">
        {children}
    </div>
);

const Alert = ({ children, type = "info" }) => (
    <div className={`p-4 rounded mb-4 ${type === "error" ? "bg-red-900" : "bg-blue-900"}`}>
        {children}
    </div>
);

const AlertTitle = ({ children }) => (
    <h3 className="font-bold mb-2">{children}</h3>
);

const AlertDescription = ({ children }) => (
    <p className="text-gray-300">{children}</p>
);

const PrisonManagementSystem = () => {
    const [queryResult, setQueryResult] = React.useState([]);
    const [visitorData, setVisitorData] = React.useState([]);
    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {
        fetchQueryResult();
        fetchVisitorData();
        generateChartData();
    }, []);

    const fetchQueryResult = async () => {
        try {
            const response = await fetch('http://localhost:5000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: 'Show all inmates' }),
            });
            const data = await response.json();
            setQueryResult(data);
        } catch (error) {
            console.error('Error fetching query result:', error);
        }
    };

    const fetchVisitorData = async () => {
        try {
            const response = await fetch('http://localhost:5000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: 'Show visitor details' }),
            });
            const data = await response.json();
            setVisitorData(data);
        } catch (error) {
            console.error('Error fetching visitor data:', error);
        }
    };

    const generateChartData = () => {
        const data = [
            { name: 'January', visitors: 120, inmates: 50 },
            { name: 'February', visitors: 95, inmates: 45 },
            { name: 'March', visitors: 140, inmates: 55 },
            { name: 'April', visitors: 110, inmates: 48 },
            { name: 'May', visitors: 130, inmates: 52 },
            { name: 'June', visitors: 100, inmates: 47 },
        ];
        setChartData(data);
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Prison Management Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Inmate Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="table-header text-left">ID</th>
                                        <th className="table-header text-left">Name</th>
                                        <th className="table-header text-left">Crime</th>
                                        <th className="table-header text-left">Admission Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queryResult.map((inmate) => (
                                        <tr key={inmate.id}>
                                            <td className="table-cell">{inmate.id}</td>
                                            <td className="table-cell">{inmate.name}</td>
                                            <td className="table-cell">{inmate.crime}</td>
                                            <td className="table-cell">{inmate.admission_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <LineChart width={500} height={250} data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#2d2d2d', border: 'none' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                                <Line type="monotone" dataKey="inmates" stroke="#82ca9d" />
                            </LineChart>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertTitle>Inmate Release Reminder</AlertTitle>
                            <AlertDescription>
                                Inmate Aditi Sharma is scheduled for release on 2024-09-01.
                            </AlertDescription>
                        </Alert>
                        <Alert type="error">
                            <AlertTitle>Capacity Warning</AlertTitle>
                            <AlertDescription>
                                Prison capacity reaching 90%. Please review admission policies.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

ReactDOM.render(<PrisonManagementSystem />, document.getElementById('root'));