import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'location.fill': 'location-on',
  'location': 'location-on',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-outline',
  'person.fill': 'person',
  'person': 'person-outline',
  'paperplane.fill': 'send',
  'chevron.right': 'chevron-right',
  'chevron.left.forwardslash.chevron.right': 'code',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}) {
  return <Icon color={color} size={size} name={MAPPING[name] || 'help-outline'} style={style} />;
}