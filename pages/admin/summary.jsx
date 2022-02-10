export default function Summary() {
	import downloadSummary from "@utils/downloadSummary";

	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/transactions`,
		params: {
			limit: limit,
			offset: (page - 1) * limit,
			filter: watch("filter") == "All" ? null : Number(watch("filter")),
		},
	});

	// ANCHOR Refetch for pagination
	useEffect(() => {
		setTimeout(() => {
			refetch();
			setLastUpdate(new Date());
		}, 60000);

		if (data) {
			setTransactions(data.transactions);
			
		}
	}, [data]);

	return <h1>hello world!</h1>;
}

Summary.layout = "admin";
