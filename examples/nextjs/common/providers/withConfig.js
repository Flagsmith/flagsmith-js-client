import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../app-actions';

const withConfig = (WrappedComponent) => {
    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedComponent);
};

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

function mapStateToProps(state) {
    const { config } = state;
    return { config };
}

export default (withConfig);
