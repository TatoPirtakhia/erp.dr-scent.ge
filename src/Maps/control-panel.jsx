import * as React from 'react';

const eventNames = ['onDragStart', 'onDrag', 'onDragEnd'];

const  round5 = (value) => {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

const  ControlPanel = (props) => {
  const { events = {} } = props;
  
  return (
    <div className="control-panel">
      <h3>Draggable Marker</h3>
      <p>Try dragging the marker to another location.</p>
      <div>
        {eventNames.map(eventName => {
          const lngLat = events[eventName];
          return (
            <div key={eventName}>
              <strong>{eventName}:</strong>{' '}
              {lngLat ? `${round5(lngLat.lng)}, ${round5(lngLat.lat)}` : <em>null</em>}
            </div>
          );
        })}
      </div>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-map-gl/tree/7.1-release/examples/draggable-markers"
          target="_new"
        >
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default ControlPanel
