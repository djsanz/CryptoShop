export function DeleteIcon(props) {
	const className = props.className ? props.className : "";
	const Tam = props.Tam ? props.Tam : "16";
	return (
		<svg width={Tam} height={Tam} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
	)
}

export function UploadIcon() {
	return (
		<svg width="18" height="18" fill="white" className="mr-2 inline" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path></svg>
	)
}

export function PlusIcon(props) {
	const Color = props.Color? props.Color:"green"
	const Tam = props.Tam? props.Tam:"50"
	const className = props.className ? props.className : "";
	const onClick = props.onClick ? props.onClick : "";
	return (
		<svg width={Tam} height={Tam} className={className} onClick={onClick}>
			<circle cx={Tam/2} cy={Tam/2} r={2*Tam/5} fill={Color} />
			<line x1={Tam/5} y1={Tam/2} x2={4*Tam/5} y2={Tam/2} stroke="white" strokeWidth={Tam/10} />
			<line x1={Tam/2} y1={Tam/5} x2={Tam/2} y2={4*Tam/5} stroke="white" strokeWidth={Tam/10} />
		</svg>
	)
}

export function MinusIcon(props) {
	const Color = props.Color? props.Color:"red"
	const Tam = props.Tam? props.Tam:"50"
	const className = props.className ? props.className : "";
	const onClick = props.onClick ? props.onClick : "";
	return (
		<svg width={Tam} height={Tam} className={className} onClick={onClick}>
			<circle cx={Tam/2} cy={Tam/2} r={2*Tam/5} fill={Color} />
			<line x1={Tam/5} y1={Tam/2} x2={4*Tam/5} y2={Tam/2} stroke="white" strokeWidth={Tam/10} />
		</svg>
	)
}