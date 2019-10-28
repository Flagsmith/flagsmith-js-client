import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../app-actions';

const withWidgets = (WrappedComponent) => {
    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedComponent);
};

const mapDispatchToProps = dispatch => bindActionCreators({
    getWidgets: AppActions.getWidgets,
}, dispatch);

function mapStateToProps(state) {
    const { widgets, widgetLoading, widgetError } = state;
    return { widgets, widgetLoading, widgetError };
}

export default (withWidgets);
