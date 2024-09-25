import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import UserItem from './UserItem';

const UserList = ({ users, onSelectUser, onDeleteUser }) => {
  const renderItem = ({ item }) => (
    <UserItem user={item} onSelectUser={onSelectUser} onDeleteUser={onDeleteUser} />
  );

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});

export default UserList;
