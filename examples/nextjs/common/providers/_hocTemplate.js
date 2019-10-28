export default (WrappedComponent) => {
    class HOC extends React.Component {
        static displayName = 'withFoo';

        constructor(props) {
            super(props);
            this.state = {};
        }

        render() {
            return (
                <WrappedComponent
                  ref="wrappedComponent"
                  {...this.props}
                  {...this.state}
                />
            );
        }
    }

    return HOC;
};
