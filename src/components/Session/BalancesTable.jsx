const React = window.React = require('react');
import Stellarify from '../../lib/Stellarify';
import Printify from '../../lib/Printify';
import AssetCard from '../AssetCard.jsx';
import RemoveTrustLink from './RemoveTrustLink.jsx';
import _ from 'lodash';

export default class BalancesTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let account = this.props.d.session.account;

    let nativeBalances = [];
    let knownBalances = [];
    let unknownBalances = [];
    account.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        return nativeBalances.push(balance);
      }
      return unknownBalances.push(balance);
    });

    const reorderedBalances = nativeBalances.concat(knownBalances, unknownBalances);

    let balanceCards = [];
    reorderedBalances.forEach(balance => {
      let balanceAsset = Stellarify.asset(balance);
      let limit = balance.limit == '922337203685.4775807' ? 'maximum': balance.limit;

      let removeLink = <RemoveTrustLink balance={balance} d={this.props.d}></RemoveTrustLink>

      let limitCell = <td>N/A</td>;
      if (balance.asset_type !== 'native') {
        limitCell = <td>Trust limit: {limit}<br />{removeLink}</td>
      }

      balanceCards.push(<tr className="BalancesTable__row" key={balance.asset_issuer + balance.asset_code}>
        <td>
          <AssetCard asset={balanceAsset} fixed={true}></AssetCard>
        </td>
        <td className="BalancesTable__row__amount">{Printify.lightenZeros(balance.balance)}</td>
        {limitCell}
      </tr>);
    })

    return <div className="island">
      <div className="island__header">
        Balances for {this.props.d.session.account.accountId()}
      </div>
      <table className="BalancesTable">
        <thead>
          <tr  className="BalancesTable__headerRow">
            <td>Asset</td>
            <td>Balance</td>
            <td>Trust</td>
          </tr>
        </thead>
        <tbody>
          {balanceCards}

        </tbody>
      </table>
    </div>
  }
}
