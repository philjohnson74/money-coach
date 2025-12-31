import { NavigationProp } from "@react-navigation/native";
import { View, Text } from "react-native";

function MortgagesScreen({navigation}: {navigation: NavigationProp<any>}): React.ReactElement {
    return (
        <View>
            <Text>Mortgages</Text>
        </View>
    );
}

export default MortgagesScreen;