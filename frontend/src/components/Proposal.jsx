import React from 'react';

export const Proposal = ({ proposal, classes }) => {
    function prozentBar(proposal) {
        const noVotes = <span style={{backgroundColor:'#00f',color:'#fff'}}>No votes</span>;
        if(isNaN(proposal.approvals) || isNaN(proposal.rejects)) {
            return noVotes;
        }
        const total = proposal.approvals + proposal.rejects;
        if(total === 0){
            return noVotes;
        }
        const background = `linear-gradient(90deg, #0f0 ${proposal.approvals * 100 / total}%, #f00 ${proposal.approvals * 100 / total}%)`;
        return (<div style={{display:'flex'}}>
            <div style={{background,width:'100%',height:'20px'}}>{proposal.approvals} out of {total} approved</div>
        </div>);
    }

    function approve() {
        console.log('approve')
    }
    function reject() {
        console.log('reject')
    }
    function execute() {}

    return <li style={classes.listItem} key={proposal.code}>
        <div>{proposal.text}</div>
        {new Date() > proposal.timeLimit
        ? <div style={classes.proposalState}>
            <div><button type='button' onClick={approve}>Approve</button></div>
            <div><button type='button' onClick={reject}>Reject</button></div>
            {prozentBar(proposal)}
            <span>{new Date() - proposal.timeLimit + ' left' }</span>
        </div>
        : <div style={classes.proposalState}>
            <div style={{gridColumn:'1/3'}}><button type='button' onClick={execute}>Execute</button></div>
            {prozentBar(proposal)}
            <span>Finished</span>
        </div>
        }
    </li>
}