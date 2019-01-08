import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Card from 'terra-card';
import Heading from 'terra-heading';
import Toggle from 'terra-toggle/lib/Toggle';
import IconChevronRight from 'terra-icon/lib/icon/IconChevronRight';
import IconChevronDown from 'terra-icon/lib/icon/IconChevronDown';

import styles from './message-panel.css';

const propTypes = {
  /**
   * Flag to determine if the message panel is collapsed or expanded
   */
  isExpanded: PropTypes.bool.isRequired,

  /**
   * Text to display in the message panel header
   */
  panelHeader: PropTypes.string.isRequired,
};

/**
 * Component representing a Message panel
 */
class MessagePanel extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      isExpanded: this.props.isExpanded,
      messages: '',
    });

    this.addMessage = this.addMessage.bind(this);
    this.toggleExpansion = this.toggleExpansion.bind(this);
  }

  componentDidMount() {
    console.error('adding event listener');
  	window.addEventListener('message', this.addMessage);
  }

  addMessage(event) {
    if (event.origin !== location.origin) {
      console.error('received message for unsupported origin: ', event.origin);
      return;
    }
    
    this.setState({ messages: this.state.messages + '\n' + event.data });
  }

  /**
   * Toggles the body display of a single message view panel
   */
  toggleExpansion() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const text = this.state.messages ? this.state.messages.split(/\n/) : '';
    const textHtml = text ? text.map((l, i) => (
      <div key={`${l}-${i}`}>{l}</div>
    )) : '';

    const iconToggle = this.state.isExpanded ? <IconChevronDown /> : <IconChevronRight />;

    //TODO Convert to use terra-scroll?
    return (
      <Card>
        <Heading
          className={styles['header-toggle']}
          level={1}
          size="medium"
          weight={700}
          onClick={this.toggleExpansion}
        >
          {iconToggle}
          {this.props.panelHeader}
        </Heading>
        <Toggle isOpen={this.state.isExpanded} isAnimated>
          <Card.Body>
            <div className={cx(styles['fhir-view'], styles['panel-text'], styles['panel-height'])}>
              <pre>
                {textHtml}
              </pre>
            </div>
          </Card.Body>
        </Toggle>
      </Card>
    );
  }
}

MessagePanel.propTypes = propTypes;

export default MessagePanel;
